const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  weak: state => state.app.weak,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  userInfo: state => state.user.info,
  multiTab: state => state.app.multiTab,
  showEditPassword:state=>state.modal.showEditPasswordModal,
  showEditPayPassword:state=>state.modal.showEditPayPwdModal,
  showOpinionModal:state=>state.modal.showOpinionModal,
  showCustomerServiceModal:state=> state.modal.showCustomerServiceModal
}

export default getters
