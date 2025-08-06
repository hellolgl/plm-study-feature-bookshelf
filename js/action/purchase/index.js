export const setVisible = (data) => {
    return (
        {
            type: 'SET_PURCHASE_VISIBLE',
            data
        })
}

export const setModules = (data) => {
    return (
        {
            type: 'SET_PRODUCTS',
            data: data,
        }
    )
}

export const setServiceType = (serviceType) => {
    return (
        {
            type: 'SET_SERVICE_TYPE',
            data: serviceType,
        }
    )
}

export const setPayCoinVisible = (data) => {
    return (
        {
            type: 'SET_PAYCOIN_VISIBLE',
            data
        })
}
