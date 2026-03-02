import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { TradeData } from '../types'

const TradeDetail: React.FC = () => {

    const { tradeId } = useParams<{ tradeId: string }>()
    const [trade, setTrade] = useState<TradeData | null>(null)


    useEffect(() => {
        axios(`http://127.0.0.1:8000/api/trades/${tradeId}`)
            .then(res => setTrade(res.data))
            .catch(err => console.log(err))
    }, [])


    return (
        <div>
            {trade?.symbol}
        </div>
    )
}

export default TradeDetail