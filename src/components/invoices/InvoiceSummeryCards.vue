<script lang="ts">
import OverviewIcon from '../icons/OverviewIcon.vue'

export default {
  name: 'DashboardSummary',
  props: {
    summaryData: {
      type: Object as () => {
        totalPaid: number
        totalOverdue: number
        totalDraft: number
        totalUnpaid: number
      },
      default: () => ({
        totalPaid: 4120102.78,
        totalOverdue: 23000.03,
        totalDraft: 12200.0,
        totalUnpaid: 87102.0,
      }),
    },
  },
  methods: {
    formatCurrency(amount: number) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    },
  },
  computed: {
    summaryCards() {
      return [
        {
          label: 'Total Paid',
          value: this.summaryData.totalPaid,
          icon: OverviewIcon,
          count: 12,
          color: 'bg-green-200',
        },
        {
          label: 'Total Overdue',
          value: this.summaryData.totalOverdue,
          icon: OverviewIcon,
          count: 3,
          color: 'bg-red-200',
        },
        {
          label: 'Total Draft',
          value: this.summaryData.totalDraft,
          icon: OverviewIcon,
          count: 5,
          color: 'bg-yellow-200',
        },
        {
          label: 'Total Unpaid',
          value: this.summaryData.totalUnpaid,
          icon: OverviewIcon,
          count: 8,
          color: 'bg-blue-200',
        },
      ]
    },
  },
}
</script>

<template>
  <div class="dashboard-summary">
    <div class="header-section">
      <h1 class="text-black text-xl md:text-3xl font-bold">Invoice</h1>
      <div class="action-buttons">
        <button class="btn-see-whats-new">SEE WHAT'S NEW</button>
        <button class="btn-create">CREATE</button>
      </div>
    </div>

    <div class="summary-cards">
      <div v-for="card in summaryCards" :key="card.label" class="card flex flex-col gap-4">
        <div>
          <component :is="card.icon" class="w-8 h-8 text-blue-500" />
        </div>

        <div>
          <div class="flex items-center justify-start gap-x-4 w-full max-w-sm">
            <h3 class="text-[12px] text-grey font-medium">{{ card.label }}</h3>
            <div
              :class="[
                'w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold',
                card.color,
              ]"
            >
              {{ card.count }}
            </div>
          </div>

          <p :class="['amount', card.isOverdue ? 'overdue' : '']">
            {{ formatCurrency(card.value) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-summary {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
  align-items: start;
  margin-bottom: 32px;
}

.header-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 16px;
}

.action-buttons {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.action-buttons button {
  padding: 1rem 2.5rem;
  gap: 8px;
  border: none;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-see-whats-new {
  background-color: white;
  color: #697598;
  font-size: 0.875rem;
  font-weight: 500;
  width: auto;
}

.btn-see-whats-new:hover {
  background-color: #e0e0e0;
  color: black;
}

.btn-create {
  background-color: #003eff;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  width: auto;
}

.btn-create:hover {
  background-color: #1565c0;
}

.summary-cards {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 22%;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: white;
  padding: 20px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

/* .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
} */

.amount {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #1f1f23;
}

.overdue {
  color: #f44336;
}

@media (max-width: 1024px) {
  .dashboard-summary {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .action-buttons {
    flex-direction: row;
  }
}

@media (max-width: 768px) {
  .header-section {
    display: flex;
    flex-direction: column;
    align-items: start;
    row-gap: 30px;
  }
  .action-buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .action-buttons button {
    padding: 0.5rem 0.7rem;
  }
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
