import React from 'react'
import type { TradeCardProps } from '../types/trade.types'
import { Link } from 'react-router-dom'

const TradeCard: React.FC<TradeCardProps> = ({ item }) => {
  return (
    <div className='border p-5'>
      <Link to={`/trades/${item.id}`}>
        <div>Date: {item.date}</div>
        <div>Model: {item.model}</div>
        <div>Symbol: {item.symbol}</div>
        <div>Direction: {item.direction}</div>
        <div>Duration: {item.durationSeconds} seconds</div>
        <div>Quantity: {item.quantity}</div>
        <div>Risk: {item.risk}</div>
        <div>RR: {item.riskReward}</div>
        <div>Range: {item.range}</div>
        <div>PNL: ${item.pnl}</div>
        <div>Fee: ${item.fee}</div>
      </Link>
    </div>
  )
}

export default TradeCard