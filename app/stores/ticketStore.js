import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from '~/stores/userStore.js'

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    tickets: [],
    ticketDetails: null,
    replies: [],
    loading: false,
    error: null,
  }),

  actions: {
    // -----------------------------
    // 1) GET TICKET LIST (GET)
    // -----------------------------
    async fetchTickets() {
      const userStore = useUserStore()
      this.loading = true

      try {
        const res = await $fetch("https://api.egamestore.com/api/users/tickets", {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            'Accept-language': "en",
          },
        })

        if (res.status && res.data?.tickets) {
          this.tickets = res.data.tickets
        }
      } catch (err) {
        console.error("❌ Fetch tickets error:", err)
      } finally {
        this.loading = false
      }
    },

    // -----------------------------
    // 2) CREATE TICKET (POST)
    // -----------------------------
    async createTicket(form) {
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("email", form.email)
      formData.append("subject", form.subject)
      formData.append("message", form.message)
      formData.append("reason_id", form.reasonId)

      if (form.orderId) formData.append("order_id", form.orderId)

      form.attachments.forEach(file => {
        formData.append("images[]", file)
      })

      try {
        const res = await axios.post(
          "https://api.egamestore.com/api/users/tickets",
          formData,
          {
            headers: {
              'Accept-language': "en",
              "Content-Type": "multipart/form-data",
            },
          },
        )

        return res.data
      } catch (err) {
        console.error("❌ Ticket create error:", err)
        throw err
      }
    },

    // -----------------------------
    // 3) GET SINGLE TICKET DETAILS (GET)
    // -----------------------------
    async fetchTicketDetails(uuid) {
      const userStore = useUserStore()
      this.loading = true

      try {
        const res = await $fetch(`https://api.egamestore.com/api/users/tickets/${uuid}`, {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            'Accept-language': "en",
          },
        })

        if (res.status) {
          this.ticketDetails = res.data
          this.replies = res.data.replies || []
        }
      } catch (err) {
        console.error("❌ Ticket details error:", err)
      } finally {
        this.loading = false
      }
    },

    // -----------------------------
    // 4) SEND REPLY IN CHAT (POST)
    // -----------------------------
    async sendReply(uuid, message, images = []) {
      const userStore = useUserStore()
      const formData = new FormData()

      if (message) formData.append("message", message)
      images.forEach(img => formData.append("images[]", img))

      try {
        const res = await axios.post(
          `https://api.egamestore.com/api/users/tickets/${uuid}/reply`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
              'Accept-language': "en",
              "Content-Type": "multipart/form-data",
            },
          },
        )

        if (res.data.status) {
          this.replies.push(res.data.data)
        }

        return res.data
      } catch (err) {
        console.error("❌ Reply error:", err)
        throw err
      }
    },

    // -----------------------------
    // 5) CLOSE TICKET (POST)
    // -----------------------------
    async closeTicket(uuid, message) {
      const userStore = useUserStore()
      const formData = new FormData()

      if (message) formData.append("message", message)

      try {
        const res = await axios.post(
          `https://api.egamestore.com/api/users/tickets/${uuid}/close`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
             'Accept-language': "en",
              "Content-Type": "multipart/form-data",
            },
          },
        )

        return res.data
      } catch (err) {
        console.error("❌ Close ticket error:", err)
        throw err
      }
    },

    // Get ticket by id
    getTicketById(uuid) {
      return this.tickets.find(t => t.uuid === uuid)
    },
  },
})
