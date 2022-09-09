/**
 * api列表
 * @type {{ForgePassword: string, SendSmsErr: string, Register: string, Logout: string, SendSms: string, UserInfo: string, Login: string, twoStepCode: string}}
 */
  
const api = {
  addTransport: `transport/add`,
  transportList: `transport/list`,
  transportInfo: `transport/info`,
  transportHandlex: `transport/handlex`,

  transportTempAdd:  `transportTemp/add`,
  transportTempDelall:  `transportTemp/delall`,
  transportTempList: `transportTemp/list`,

  
  getNeedGoodListByNeed:  `needGoods/listbyneed`,
  getInfoList:  `needGoods/infolist`,  
  tranlist:  `needGoods/tranlist`,    

  getNeedList: `need/list`,  
  getNeedInfo: `need/info`,  
  checkNeed: `need/check`, 
  

  truckSetDriver: `/truck/setdriver`,  
  getTruckList: `/truck/list`,  

  addWarehouseInfo: `/warehouse/add`,  
  getWarehouseList: `/warehouse/list`,

  addStoreInfo:`/store/add`, 
  getStoreList:`/store/list`,
  
  addgoods:`/goods/add`, 
  getGoodsList:`/goods/list`, 
  addGoodsStock:`/goods/addStock`, 

  addDriverInfo: `/driver/add`,  
  getDriverList: `/driver/list`,


}
export default api
