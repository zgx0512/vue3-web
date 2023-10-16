import request from '@/utils/request'
import { trademarkListResponseData, trademarkResponseData } from './type'
enum API {
  TRADEMARKLIST_URL = '/admin/product/baseTrademark/',
  TRADEMARKLISTALL_URL = '/admin/product/baseTrademark/getTrademarkList',
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  REMOVETRADEMARK_URL = '/admin/product/baseTrademark/remove/',
}
// 获取品牌列表
export const reqTrademarkList = (page: number, limit: number) => {
  return request<trademarkListResponseData, any>({
    url: API.TRADEMARKLIST_URL + `${page}/${limit}`,
    method: 'GET',
  })
}
// 获取全部品牌列表
export const reqTrademarkListAll = () => {
  return request.get<trademarkListResponseData, any>(API.TRADEMARKLISTALL_URL)
}
// 新增|修改品牌
export const reqAddOrUpdateTrademark = (trademark: trademarkResponseData) => {
  if (trademark.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, trademark)
  } else {
    return request.post<any, any>(API.ADDTRADEMARK_URL, trademark)
  }
}
// 删除品牌
export const reqRemoveTrademark = (id: number) => {
  return request.delete<any, any>(API.REMOVETRADEMARK_URL + id)
}
