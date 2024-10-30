// @ts-nocheck
import { utils, writeFile } from 'xlsx'

export const _onExportToExcel = (
  data: any,
  filename: string,
  headers?: string[],
) => {
  const ws = utils.json_to_sheet(data, { header: headers })
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Sheet1')
  writeFile(wb, filename)
}
