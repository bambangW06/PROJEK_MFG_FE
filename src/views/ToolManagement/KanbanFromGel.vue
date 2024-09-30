<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Request Tool From Gel</h4>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th class="col-no">No</th>
              <th class="col-request-date">Request Date</th>
              <th class="col-line">Line</th>
              <th class="col-tool-name">Tool Name</th>
              <th class="col-op">OP</th>
              <th class="col-quantity">Quantity</th>
              <th class="col-notes">Problem</th>
              <th class="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(kanban, index) in GET_KANBAN_FROM_GEL" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ kanban.created_at }}</td>
              <td>{{ kanban.line_nm }}</td>
              <td>{{ kanban.tool_nm }}</td>
              <td>{{ kanban.op_no }}</td>
              <td>{{ kanban.quantity }}</td>
              <td>{{ kanban.notes }}</td>
              <td>
                <button
                  v-if="!kanban.is_prepared"
                  type="button"
                  class="btn btn-primary"
                  @click="prepared(index)"
                >
                  Prepare
                </button>
                <button v-else type="button" class="btn btn-success">
                  Prepared
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ACTION_GET_KANBAN_FROM_GEL,
  ACTION_PREPARED,
  GET_KANBAN_FROM_GEL,
} from '@/store/KanbanFromGel.module'

import { mapGetters } from 'vuex'

export default {
  name: 'KanbanFromGel',

  computed: {
    ...mapGetters([GET_KANBAN_FROM_GEL]),
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_KANBAN_FROM_GEL)
  },

  methods: {
    async prepared(index) {
      try {
        const id = this.GET_KANBAN_FROM_GEL[index].detail_id
        console.log('id', id)
        await this.$store.dispatch(ACTION_PREPARED, id)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style>
.table-bordered th,
.table-bordered td {
  text-align: center;
  vertical-align: middle;
}

.col-no {
  width: 5%;
}

.col-request-date {
  width: 15%;
}

.col-line {
  width: 10%;
}

.col-tool-name {
  width: 15%;
}

.col-op {
  width: 10%;
}

.col-quantity {
  width: 10%;
}

.col-notes {
  width: 25%; /* Larger width for notes */
}

.col-action {
  width: 10%;
}

.table-bordered th {
  background-color: rgb(198, 240, 240);
  border: 1px solid black;
}
</style>
