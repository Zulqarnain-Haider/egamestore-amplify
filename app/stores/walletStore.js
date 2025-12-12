// stores/walletStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from '~/stores/userStore'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    balance: 0,
    walletId: null,

    transactions: [],
    todayTransactions: [],
    statistics: null,
    transactionDetails: null,

    topupFees: null,
    topupResult: null,

    // filters
    filters: {
      start_date: null,
      end_date: null,
      type: null,
      per_page: 10,
      page: 1,
    },

    loading: false,
    error: null,
  }),

  actions: {
    // ------------------------------
    // Helper: Auth Headers
    // ------------------------------
    getHeaders() {
      const userStore = useUserStore()
      return {
        Authorization: `Bearer ${userStore.token}`,
        "Accept-language": "en",
      }
    },

    // =============================================================
    // 1️⃣ GET — Wallet Balance
    // =============================================================
    async fetchWallet() {
      try {
        this.loading = true
        const res = await axios.get(
          'https://api.egamestore.com/api/users/wallets',
          { headers: this.getHeaders() }
        )

        this.balance = res.data.data.balance
        this.walletId = res.data.data.id
      } catch (error) {
        console.error('Wallet Error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch wallet'
      } finally {
        this.loading = false
      }
    },

    // =============================================================
    // 2️⃣ POST — Calculate Topup Fees
    // amount, payment_id
    // =============================================================
    async calculateTopupFees(amount, payment_id) {
      try {
        this.loading = true

        const body = new FormData()
        body.append('amount', amount)
        body.append('payment_id', payment_id)

        const res = await axios.post(
          'https://api.egamestore.com/api/users/wallets/calculate-topup-fees',
          body,
          { headers: this.getHeaders() }
        )

        this.topupFees = res.data.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to calculate fees'
      } finally {
        this.loading = false
      }
    },

    // =============================================================
    // 3️⃣ POST — Topup Wallet
    // (Confirm from you: correct endpoint required)
    // =============================================================
    async topupWallet(amount, payment_id) {
      try {
        this.loading = true

        const body = new FormData()
        body.append('amount', amount)
        body.append('payment_id', payment_id)

        const res = await axios.post(
          'https://api.egamestore.com/api/users/wallets/topup',
          body,
          { headers: this.getHeaders() }
        )

        this.topupResult = res.data.data

        // Update wallet balance after topup
        await this.fetchWallet()
      } catch (error) {
        this.error = error.response?.data?.message || 'Topup failed'
      } finally {
        this.loading = false
      }
    },

    // =============================================================
    // 4️⃣ GET — Wallet Transactions w/ Filters + Pagination
    // =============================================================
    async fetchTransactions() {
      try {
        this.loading = true

        const params = {
          start_date: this.filters.start_date,
          end_date: this.filters.end_date,
          type: this.filters.type,
          per_page: this.filters.per_page,
          page: this.filters.page,
        }

        const res = await axios.get(
          'https://api.egamestore.com/api/users/wallets/transactions',
          {
            headers: this.getHeaders(),
            params,
          }
        )

        this.transactions = res.data.data.transactions
        this.balance = res.data.data.wallet.balance
      } catch (error) {
        this.error = 'Failed to load transactions'
      } finally {
        this.loading = false
      }
    },

    // =============================================================
    // 5️⃣ GET — Today’s Transactions
    // =============================================================
    async fetchTodayTransactions() {
      try {
        this.loading = true
        const res = await axios.get(
          'https://api.egamestore.com/api/users/wallets/transactions/today',
          { headers: this.getHeaders() }
        )
        this.todayTransactions = res.data.data
      } catch (error) {
        this.error = 'Failed to load today’s transactions'
      } finally {
        this.loading = false
      }
    },

    // =============================================================
    // 6️⃣ GET — Statistics
    // =============================================================
    async fetchStatistics(start = null, end = null) {
      try {
        this.loading = true
        const res = await axios.get(
          'https://api.egamestore.com/api/users/wallets/transactions/statistics',
          {
            headers: this.getHeaders(),
            params: {
              start_date: start,
              end_date: end,
            },
          }
        )

        this.statistics = res.data.data
      } catch (error) {
        this.error = 'Failed to load statistics'
      } finally {
        this.loading = false
      }
    },

    // =============================================================
    // 7️⃣ GET — Transaction Details
    // =============================================================
    async fetchTransactionDetails(id) {
      try {
        this.loading = true
        const res = await axios.get(
          `https://api.egamestore.com/api/users/wallets/transactions/${id}`,
          { headers: this.getHeaders() }
        )

        this.transactionDetails = res.data.data
      } catch (error) {
        this.error = 'Failed to load transaction details'
      } finally {
        this.loading = false
      }
    },
  },
})
