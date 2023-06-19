import { useEffect, useRef } from "react"
import {CookiesProvider, useCookies} from 'react-cookie';


export default function TgwDiscussion(props) {
    const [cookies, setCookie] = useCookies(['mode', 'primary']);
    const ref = useRef(null)

    useEffect(() => {
        if (ref.current) {
            const script = document.createElement('script')
            script.src = 'https://telegram.org/js/telegram-widget.js?22'
            script.setAttribute('data-telegram-discussion', props.link)
            script.setAttribute('data-width', '100%')
            if (cookies.mode == 'dark') {
                script.setAttribute('data-dark', '1')
            }
            script.setAttribute('data-color', cookies.primary[500])
            script.async = true
            ref.current.appendChild(script)
        }
        return () => {
            if (ref.current) {
                ref.current.replaceChildren()
            }
        }
    }, [props.link])
    
    return (
        <div className="telegram-discussion" ref={ref} />
    )
}