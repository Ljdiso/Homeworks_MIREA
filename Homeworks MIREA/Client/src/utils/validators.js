export function emailValidation(text) {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    // if (text.length === 0) { return '' }
    if (!text.match(regex)) { return 'Некорректный формат email-адреса' }
    return ''
}

export function nameValidation(text) {
    // if (text.length === 0) { return '' }
    if (text.length < 1) { return 'Минимум 1 симмвол' }
    else if (text.length > 30) { return 'Не более 30 символов' }
    return ''
}

export function passwordValidation(text) {
    // if (text.length === 0) { return '' }
    if (text.length < 6) { return 'Минимум 6 символов' }
    else if (text.length > 30) { return 'Не более 30 символов' }
    return ''
}
