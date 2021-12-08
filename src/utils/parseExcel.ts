import { useEffect, useState } from 'react';
import XLSX from 'xlsx';
import excel, { Column } from 'exceljs';
import { saveAs } from 'file-saver';

export const useGenerateExcel = (cb?) => {
    const [generating, setGenerating] = useState(false);

    const generate = ({ sheetName, columns, data, fileName, option }: { sheetName: string, fileName: string; columns: Partial<excel.Column>[], data: any[], option?: any }) => {
        if (data && data.length && columns.length) {
            setGenerating(true);

            var workBook = new excel.Workbook();
            var worksheet = workBook.addWorksheet(sheetName || 'Sample');
            worksheet.columns = columns;
            worksheet.getRow(1).font = { bold: true };
            if (option && option === "IS_EVENT_LIST") {
                worksheet.mergeCells("C1:D1");
            }
            worksheet.addRows(data)
            workBook.xlsx.writeBuffer().then(function (buffer) {
                saveAs(
                    new Blob([buffer], { type: "application/octet-stream" }),
                    `${fileName}.xlsx`
                );
                cb && cb();
            });
        }
    }

    return {
        generate,
        generating
    }

}

export const useDownloadSampleDevice = () => {
    const { generate, generating } = useGenerateExcel();
    const columns: Partial<Column>[] = [
        {
            header: 'DEVICE_UID',
            key: 'uid',
            width: 25
        },
        {
            header: 'MODEL_ID',
            key: 'modelId',
            width: 25
        },
        {
            header: 'DEVICE_VERSION',
            key: 'version',
            width: 25
        },
    ]

    const data = [
        {
            uid: '123456789012396',
            modelId:'WT100-0001',
            version:''
        }
    ]

    const downloadSampleDevice = () => {
        generate({
            data,
            columns,
            fileName: 'sample_devices',
            sheetName: 'Sample Devices'
        })
    }

    return {
        downloadSampleDevice,
        generating
    };
}

export const parseExcel = <T>(f, cb: (param: T[]) => void) => {
    if (f) {
        var r = new FileReader();
        r.onload = e => {
            var contents = processExcel<T>((e as any).target.result, cb);
            console.log(contents)

        }
        r.readAsBinaryString(f);
    } else {
        console.log("Failed to load file");
    }
}

const processExcel = <T>(data, cb: (param: T[]) => void) => {
    var workbook = XLSX.read(data, {
        type: 'binary'
    }) as any;
    const sheetName = workbook.SheetNames[0];
    if (sheetName) {
        const sheetData = workbook.Sheets[sheetName];
        if (sheetData) {

            var res = XLSX.utils.sheet_to_json(sheetData);
            if (res && Array.isArray(res)) {
                cb(res as T[])

                // let result: any[][] = [];
                // for (let item of res) {
                //     const row = Object.values(item);
                //     result.push(row);
                // }


                // console.log(result)
            }
        }

    }

}
