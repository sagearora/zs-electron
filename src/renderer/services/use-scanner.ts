import { useEffect } from 'react';
import { resolveQr } from './qr-service';

export type useScannerProps = {
    is_scanning?: boolean;
    onScan: (data: any) => void;
}
function useScanner({
    is_scanning,
    onScan,
}: useScannerProps) {
    let code = "";
    let reading = false;
    function onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            const data = resolveQr(code)
            console.log(code)
            if (data) {
                onScan(data)
            }
            code = "";
        } else if(event.key === 'Shift') { // skip over shift key

        } else {
            code += event.key; //while this is not an 'enter' it stores the every key            
        }

        //run a timeout of 200ms at the first read and clear everything
        if (!reading) {
            reading = true;
            setTimeout(() => {
                code = "";
                reading = false;
            }, 500);  //200 works fine for me but you can adjust it
        }
    }
    useEffect(() => {
        if (!is_scanning) {
            return;
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [is_scanning])
}

export default useScanner