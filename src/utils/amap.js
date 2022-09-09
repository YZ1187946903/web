import VueAMap from 'vue-amap'
VueAMap.initAMapApiLoader({
  key: '8a637bdfe9de70f2a2a3752cf1493989',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType','AMap.Autocomplete',"AMap.Geocoder","AMap.Marker","AMap.Polyline"],
  v: '1.4.4'
});
export default VueAMap