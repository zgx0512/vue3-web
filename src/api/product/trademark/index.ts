import request from '@/utils/request'
import { trademarkListResponseData } from './type'
enum API {
  TRADEMARKLIST_URL = '/admin/product/baseTrademark/',
  TRADEMARKLISTALL_URL = '/admin/product/baseTrademark/getTrademarkList',
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
