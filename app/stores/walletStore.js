// stores/walletStore.js
import { defineStore } from 'pinia'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    totalPoints: 1250,
    weeklyPoints: 250,

    earnOptions: [
      { 
        id: 1,
        title: 'Complete Games',
        description: 'Earn 50–200 points per game',
        icon: '/wallet/EranPoint1.png'
      },
      { 
        id: 2,
        title: 'Daily Login',
        description: 'Get 25 points daily',
        icon: '/wallet/EranPoint2.svg'
      },
      { 
        id: 3,
        title: 'Refer Friends',
        description: 'Earn 500 points per referral',
        icon: '/wallet/EranPoint3.svg'
      },
    ],

    useOptions: [
      {
        id: 1,
        title: 'Discount Coupons',
        description: 'Starting from 500 points',
        action: 'Redeem',
        color: 'text-primary',
        icon: '/wallet/UsePoint1.svg'
      },
      {
        id: 2,
        title: 'Free Shipping',
        description: '200 points per order',
        action: 'Redeem',
        color: 'text-primary',
        icon: '/wallet/UsePoint2.svg'
      },
      {
        id: 3,
        title: 'Exclusive Products',
        description: 'Premium items available',
        action: 'Browse',
        color: 'text-orange-400',
        icon: '/wallet/UsePoint3.svg'
      },
    ],

    transactions: [
      { date: 'Dec 28, 2024', action: 'Game Completed', points: '+150', notes: 'Space Shooter Level 5' },
      { date: 'Dec 27, 2024', action: 'Daily Login', points: '+25', notes: 'Daily reward claimed' },
      { date: 'Dec 26, 2024', action: 'Gift Card Redeemed', points: '-5000', notes: 'Steam $50 Gift Card' },
      { date: 'Dec 26, 2024', action: 'Achievement Unlocked', points: '+1000', notes: 'First Victory' },
      { date: 'Dec 24, 2024', action: 'Friend Referral', points: '+500', notes: 'Referred @player123' },
    ]
  }),

  getters: {
    positivePoints: (state) => state.transactions.filter(t => t.points.startsWith('+')),
    negativePoints: (state) => state.transactions.filter(t => t.points.startsWith('-')),
  },

  actions: {
    addTransaction(entry) {
      this.transactions.unshift(entry)
    },
    clearTransactions() {
      this.transactions = []
    }
  }
})
