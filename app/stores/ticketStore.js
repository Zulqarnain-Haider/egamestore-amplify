// ~/stores/ticketStore.js
import { defineStore } from 'pinia'

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    tickets: [
      // example ticket (will show in Previous Tickets)
      {
        id: 101,
        subject: 'Missing download link',
        name: 'Hamza',
        email: 'hamza@example.com',
        reason: 'Order issue',
        status: 'active', // open | closed
        createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        orderId: '12345'
      },
      {
    id: 102,
    subject: 'Payment not confirmed',
    name: 'Hamza',
    email: 'hamza@example.com',
    reason: 'Payment problem',
    status: 'active',
    createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    orderId: '67890'
  },
  {
    id: 103,
    subject: 'Login',
    name: 'Hamza',
    email: 'hamza@example.com',
    reason: 'Payment problem',
    status: 'active',
    createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    orderId: '67890'
  }
    ],
    messages: {
      // keyed by ticket id
      101: [
        {
          id: Date.now() - 1000 * 60 * 60,
          sender: 'support',
          text: "Hello! I'm Alex from support. I see your order and will help.",
          time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          avatar: '/wallet/AkexChatImg.png'
        },
        {
          id: Date.now() - 1000 * 60 * 30,
          sender: 'user',
          text: "I bought the game but didn't receive the link.",
          time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          avatar: '/wallet/UserChatImg.png'
        }
      ],
       102: [
    {
      id: Date.now() - 120000,
      sender: 'support',
      text: 'Hello! We noticed your payment is still processing.',
      time: new Date(Date.now() - 120000).toISOString(),
      avatar: '/wallet/AkexChatImg.png'
    },
    {
      id: Date.now() - 60000,
      sender: 'user',
      text: 'Okay, I’ll wait — thanks!',
      time: new Date(Date.now() - 60000).toISOString(),
      avatar: '/wallet/UserChatImg.png'
    }
  ]
    },
    selectedTicketId: null,
    reasons: [
      'Order issue',
      'Payment problem',
      'Account / Login',
      'Technical support',
      'Other'
    ],
  }),
  getters: {
    getTicketById: (state) => (id) => state.tickets.find(t => Number(t.id) === Number(id)),
    getMessagesFor: (state) => (id) => state.messages?.[id] ?? []
  },
  actions: {
    loadFromStorage() {
  if (process.client) {
    try {
      const t = JSON.parse(localStorage.getItem('tickets') || 'null')
      const m = JSON.parse(localStorage.getItem('ticket_messages') || 'null')
      const sid = JSON.parse(localStorage.getItem('selected_ticket') || 'null')
      if (Array.isArray(t)) this.tickets = t
      if (m && typeof m === 'object') this.messages = m
      if (sid) this.selectedTicketId = sid
    } catch (e) {
      console.warn('Failed to load from localStorage', e)
    }
  }
},

    saveToStorage() {
      if (process.client) {
      localStorage.setItem('tickets', JSON.stringify(this.tickets))
      localStorage.setItem('ticket_messages', JSON.stringify(this.messages))
      localStorage.setItem('selected_ticket', JSON.stringify(this.selectedTicketId))
}
    },

    createTicket(payload) {
      // payload: { name, email, reason, subject, message, orderId, attachments }
      const id = Date.now()
      const ticket = {
        id,
        subject: payload.subject || 'No subject',
        name: payload.name || 'Guest',
        email: payload.email || '',
        reason: payload.reason || 'Other',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        orderId: payload.orderId ?? null,
        attachments: payload.attachments ?? []
      }
      this.tickets.unshift(ticket)
      // initial message
      this.messages[id] = [
        {
          id: Date.now(),
          sender: 'user',
          text: payload.message || '',
          time: new Date().toISOString(),
          avatar: payload.avatar || '/wallet/UserChatImg.png'
        }
      ]
      this.selectedTicketId = id
      this.saveToStorage()
      return id
    },

    addMessage(ticketId, msg) {
      if (!this.messages[ticketId]) this.messages[ticketId] = []
      this.messages[ticketId].push({
        id: Date.now() + Math.floor(Math.random()*1000),
        sender: msg.sender,
        text: msg.text,
        time: new Date().toISOString(),
        avatar: msg.avatar ?? (msg.sender === 'user' ? '/wallet/UserChatImg.png' : '/wallet/AkexChatImg.png')
      })
      const t = this.tickets.find(x => Number(x.id) === Number(ticketId))
      if (t) t.updatedAt = new Date().toISOString()

      this.saveToStorage()
    },

    selectTicket(id) {
      this.selectedTicketId = Number(id)
      this.saveToStorage()
    },

    closeTicket(id) {
      const t = this.tickets.find(x => Number(x.id) === Number(id))
      if (t) {
        t.status = 'closed'
        t.updatedAt = new Date().toISOString()
        this.saveToStorage()
      }
    },

    clearAll() {
      this.tickets = []
      this.messages = {}
      this.selectedTicketId = null
      this.saveToStorage()
    }
  }
}) 
