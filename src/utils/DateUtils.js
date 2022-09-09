const getMyDateTime =(str) =>{
  const oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds(),
    oTime = oYear + '-' +getO(oMonth) + '-' +getO(oDay) + ' ' + getO(oHour) + ':' + getO(oMin) + ':' + getO(oSen); //最后拼接时间
  return oTime;
};
const getO = (s) =>{
  if (s < 10){
   return '0' + s ;
  }
  return s;
}
export default getMyDateTime;