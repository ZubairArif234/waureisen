// src/utils/mapClusterer.js
/**
 * Map marker clustering utility for Google Maps
 * Optimizes performance by clustering nearby markers
 */

// Distance threshold for clustering (in pixels)
const CLUSTER_DISTANCE_THRESHOLD = 40;

// Maximum number of unclustered markers to render before applying clustering
const MAX_UNCLUSTERED_MARKERS = 100;

/**
 * Creates clusters from a set of markers based on screen proximity
 * 
 * @param {Array} markers - Array of Google Maps marker objects
 * @param {Object} map - Google Maps map instance
 * @returns {Array} Array of clusters, each containing markers
 */
export const createClusters = (markers, map) => {
  if (!map || !markers || markers.length === 0) {
    return [];
  }
  
  // Skip clustering if we have a small number of markers
  if (markers.length <= MAX_UNCLUSTERED_MARKERS) {
    return markers.map(marker => ({ 
      markers: [marker],
      position: marker.getPosition(),
      isSingle: true
    }));
  }
  
  const projection = map.getProjection();
  const zoom = map.getZoom();
  
  if (!projection) {
    return markers.map(marker => ({ 
      markers: [marker],
      position: marker.getPosition(),
      isSingle: true
    }));
  }
  
  // Convert lat/lng to pixel coordinates
  const markerPixels = markers.map(marker => {
    const position = marker.getPosition();
    const point = projection.fromLatLngToPoint(position);
    return { 
      marker,
      x: point.x,
      y: point.y,
      position
    };
  });
  
  // Array to track which markers have been clustered
  const clustered = new Array(markers.length).fill(false);
  
  // Results array
  const clusters = [];
  
  // Process each marker
  for (let i = 0; i < markerPixels.length; i++) {
    // Skip if this marker has already been clustered
    if (clustered[i]) continue;
    
    const cluster = {
      markers: [markerPixels[i].marker],
      markerData: [markerPixels[i]],
      position: markerPixels[i].position,
      isSingle: true
    };
    
    clustered[i] = true;
    
    // Find nearby markers to cluster
    for (let j = i + 1; j < markerPixels.length; j++) {
      // Skip if this marker has already been clustered
      if (clustered[j]) continue;
      
      // Calculate pixel distance between markers
      const distance = Math.sqrt(
        Math.pow(markerPixels[i].x - markerPixels[j].x, 2) +
        Math.pow(markerPixels[i].y - markerPixels[j].y, 2)
      );
      
      // Adjust distance based on zoom (closer zoom = more distance between pixels)
      const adjustedDistance = distance * Math.pow(2, zoom);
      
      // If markers are close enough, add to cluster
      if (adjustedDistance <= CLUSTER_DISTANCE_THRESHOLD) {
        cluster.markers.push(markerPixels[j].marker);
        cluster.markerData.push(markerPixels[j]);
        clustered[j] = true;
        cluster.isSingle = false;
      }
    }
    
    // Compute center position for cluster
    if (!cluster.isSingle) {
      const avgLat = cluster.markerData.reduce((sum, m) => sum + m.position.lat(), 0) / cluster.markerData.length;
      const avgLng = cluster.markerData.reduce((sum, m) => sum + m.position.lng(), 0) / cluster.markerData.length;
      
      cluster.position = new google.maps.LatLng(avgLat, avgLng);
    }
    
    clusters.push(cluster);
  }
  
  return clusters;
};

/**
 * Creates cluster markers from clusters
 * 
 * @param {Array} clusters - Array of cluster objects from createClusters()
 * @param {Object} map - Google Maps map instance
 * @param {Function} clusterClickHandler - Handler for when a cluster is clicked
 * @returns {Array} Array of Google Maps marker objects
 */
export const createClusterMarkers = (clusters, map, clusterClickHandler) => {
  return clusters.map(cluster => {
    if (cluster.isSingle) {
      // For single markers, just return the marker
      return cluster.markers[0];
    } else {
      // For clusters, create a new marker with count
      const count = cluster.markers.length;
      
      // Create a cluster marker
      const marker = new google.maps.Marker({
        position: cluster.position,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#B4A481',
          fillOpacity: 0.9,
          strokeWeight: 2,
          strokeColor: '#ffffff',
          scale: Math.max(14, Math.min(20, 14 + count / 10)) // Size based on count
        },
        label: {
          text: count.toString(),
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 'bold'
        },
        zIndex: 1000,
        optimized: true,
        // Store the original markers in the cluster
        clusterMarkers: cluster.markers
      });
      
      // Add click handler
      if (clusterClickHandler) {
        marker.addListener('click', () => {
          clusterClickHandler(marker, cluster.markers);
        });
      }
      
      return marker;
    }
  });
};

/**
 * Handler for when a cluster is clicked
 * Zooms to show all markers in the cluster
 * 
 * @param {Object} clusterMarker - The cluster marker that was clicked
 * @param {Array} markers - Array of markers in the cluster
 * @param {Object} map - Google Maps map instance
 */
export const handleClusterClick = (clusterMarker, markers, map) => {
  // Create bounds that include all markers in the cluster
  const bounds = new google.maps.LatLngBounds();
  
  // Add each marker position to the bounds
  markers.forEach(marker => {
    bounds.extend(marker.getPosition());
  });
  
  // Zoom map to fit all markers
  map.fitBounds(bounds);
  
  // If the zoom would be too close (e.g., if all markers are in exactly the same spot)
  // limit the zoom level
  const listener = google.maps.event.addListener(map, 'idle', () => {
    if (map.getZoom() > 18) {
      map.setZoom(18);
    }
    google.maps.event.removeListener(listener);
  });
};