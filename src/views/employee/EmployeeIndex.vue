<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { onMounted, ref, reactive, watch } from 'vue'
import { useEmployeeStore } from '@/stores/employee'
import { useJobPositionStore } from '@/stores/job-position'
import { useDepartmentStore } from '@/stores/department'
import { storeToRefs } from 'pinia'
import { useVuelidate } from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'
import dayjs from 'dayjs'
import { type Employee, type FormEmployee, type Filters } from '@/types'

// Lifecycle Hooks
onMounted(() => {
  getEmployees()
  if (departments.value.length === 0) {
    getDepartments()
  }
  if (jobPositions.value.length === 0) {
    getJobPositions()
  }
})

// Stores
const toast = useToast()
const employeeStore = useEmployeeStore()
const jobPositionStore = useJobPositionStore()
const departmentStore = useDepartmentStore()
const { employees, meta } = storeToRefs(employeeStore)
const { departments } = storeToRefs(departmentStore)
const { jobPositions } = storeToRefs(jobPositionStore)

// Refs and Reactives
const expandedRows = ref<any>({})
const selectedEmployee = ref<Employee | null>(null)
const form = reactive<FormEmployee>({
  name: '',
  gender: '',
  email: '',
  phone: '',
  dateOfBirth: null,
  address: '',
  department: null,
  jobPosition: null
})

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Invalid email address', email)
  },
  name: {
    required: helpers.withMessage('Name is required', required)
  },
  gender: {
    required: helpers.withMessage('Gender is required', required)
  },
  phone: {
    required: helpers.withMessage('Phone number is required', required)
  },
  dateOfBirth: {
    required: helpers.withMessage('Date of Birth is required', required)
  },
  address: {
    required: helpers.withMessage('Address is required', required)
  },
  department: {
    required: helpers.withMessage('Department is required', required)
  },
  jobPosition: {
    required: helpers.withMessage('Job Position is required', required)
  }
}
const v$ = useVuelidate(rules, form)

const employeeDialog = ref<boolean>(false)
const deleteEmployeeDialog = ref<boolean>(false)
const filters = reactive<Filters>({
  page: 0,
  limit: 10,
  search: ''
})
const isLoading = ref<boolean>(false)
const isLoadingForm = ref<boolean>(false)
const submitted = ref<boolean>(false)

// Functions
async function getEmployees() {
  isLoading.value = true
  await employeeStore.getEmployees(filters.page, filters.limit, filters.search)
  isLoading.value = false
}

async function getDepartments() {
  await departmentStore.getDepartments()
}

async function getJobPositions() {
  await jobPositionStore.getJobPositions()
}

function openNew() {
  resetForm()
  submitted.value = false
  employeeDialog.value = true
}

function hideDialog() {
  employeeDialog.value = false
  submitted.value = false
}

function resetForm() {
  selectedEmployee.value = null
  form.name = ''
  form.gender = ''
  form.email = ''
  form.phone = ''
  form.dateOfBirth = null
  form.address = ''
  form.department = null
  form.jobPosition = null
}

async function saveEmployee() {
  isLoadingForm.value = true

  const payload = {
    name: form.name,
    gender: form.gender,
    email: form.email,
    phone: form.phone,
    date_of_birth: dayjs(form.dateOfBirth).format('YYYY-MM-DD'),
    address: form.address,
    department_id: form.department?.id,
    job_position_id: form.jobPosition?.id
  }

  try {
    if (selectedEmployee.value?.id) {
      await employeeStore.updateEmployee({ ...payload, id: selectedEmployee.value.id })
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Employee Updated',
        life: 5000
      })
    } else {
      await employeeStore.addEmployee(payload)
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Employee Created',
        life: 5000
      })
    }
    getEmployees()
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.response.data.data.message,
      life: 5000
    })
  }

  hideDialog()
  isLoadingForm.value = false
}

function editEmployee(item: Employee) {
  selectedEmployee.value = { ...item }
  form.name = item.name
  form.gender = item.gender
  form.email = item.email
  form.phone = item.phone
  form.dateOfBirth = new Date(item.date_of_birth)
  form.address = item.address
  form.department = departments.value.find((it) => it.title === item.departement) || null
  form.jobPosition = jobPositions.value.find((it) => it.title === item.position) || null
  employeeDialog.value = true
}

function confirmDeleteEmployee(item: Employee) {
  selectedEmployee.value = item
  deleteEmployeeDialog.value = true
}

async function deleteEmployee() {
  try {
    isLoadingForm.value = true
    if (selectedEmployee.value) {
      await employeeStore.deleteEmployee(selectedEmployee.value.id)
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Employee Deleted',
        life: 5000
      })
      getEmployees()
    }
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.response.data.data.message,
      life: 5000
    })
  } finally {
    isLoadingForm.value = false
    deleteEmployeeDialog.value = false
    selectedEmployee.value = null
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'warn'
    default:
      return 'secondary'
  }
}

function getGenderLabel(gender: string) {
  switch (gender) {
    case 'male':
      return {
        label: 'Male',
        severity: 'info'
      }
    case 'female':
      return {
        label: 'Female',
        severity: 'error'
      }
    default:
      return {
        label: '-',
        severity: 'secondary'
      }
  }
}

function formatDateOfBirth(date: string) {
  return dayjs(date).format('DD MMMM YYYY')
}

function onChangePage(meta: { page: number; rows: number }) {
  filters.page = meta.page
  filters.limit = meta.rows
}

watch(
  () => filters,
  () => {
    getEmployees()
  },
  {
    deep: true
  }
)
</script>

<template>
  <div>
    <div class="card">
      <div class="font-semibold text-xl mb-4">Manage Employees</div>
      <DataTable
        ref="dt"
        v-model:expandedRows="expandedRows"
        :value="employees"
        dataKey="id"
        :rows="filters.limit"
        :loading="isLoading"
      >
        <template #empty> No employee found. </template>
        <template #loading> Loading employee data. Please wait... </template>
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <Button
              label="Add Employee"
              icon="pi pi-plus"
              severity="primary"
              class=""
              @click="openNew"
            />
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters.search" placeholder="Search..." />
            </IconField>
          </div>
        </template>

        <Column expander style="width: 1rem" />
        <Column field="no" header="No" style="min-width: 1rem">
          <template #body="slotProps">
            {{ filters.page * filters.limit + (slotProps.index + 1) }}
          </template>
        </Column>
        <Column field="name" header="Name" style="min-width: 15rem"></Column>
        <Column field="email" header="Email" style="min-width: 14rem"> </Column>
        <Column field="gender" header="Gender" style="min-width: 1.5rem">
          <template #body="slotProps">
            <Message :severity="getGenderLabel(slotProps.data.gender)?.severity" class="w-fit">
              {{ getGenderLabel(slotProps.data.gender).label }}
            </Message>
          </template>
        </Column>
        <Column field="status" header="Status" style="min-width: 4rem">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.status"
              :severity="getStatusLabel(slotProps.data.status)"
              class="uppercase"
            />
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 120px">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              severity="secondary"
              class="mr-2"
              @click="editEmployee(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteEmployee(slotProps.data)"
            />
          </template>
        </Column>

        <template #footer>
          <Paginator
            :rows="filters.limit"
            :totalRecords="meta.total"
            :rowsPerPageOptions="[5, 10, 25]"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
            @page="onChangePage"
          ></Paginator>
        </template>

        <template #expansion="slotProps">
          <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12 md:col-span-3 mb-4">
              <span class="text-surface-900 font-medium"> Phone Number </span>
              <div class="mt-2 text-muted-color">
                {{ slotProps.data.phone }}
              </div>
            </div>
            <div class="col-span-12 md:col-span-3 mb-4">
              <span class="text-surface-900 font-medium"> Date of Birth </span>
              <div class="mt-2">
                {{ formatDateOfBirth(slotProps.data.date_of_birth) }}
              </div>
            </div>
            <div class="col-span-12 md:col-span-3 mb-4">
              <span class="text-surface-900 font-medium"> Department </span>
              <div class="mt-2 text-muted-color">
                {{ slotProps.data.departement }}
              </div>
            </div>
            <div class="col-span-12 md:col-span-3 mb-4">
              <span class="text-surface-900 font-medium"> Position </span>
              <div class="mt-2 text-muted-color">
                {{ slotProps.data.position }}
              </div>
            </div>
            <div class="col-span-12 md:col-span-6 mb-4">
              <span class="text-surface-900 font-medium"> Address </span>
              <div class="mt-2 text-muted-color">
                {{ slotProps.data.address }}
              </div>
            </div>
          </div>
        </template>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="employeeDialog"
      :style="{ width: '600px' }"
      :header="selectedEmployee ? 'Edit Employee' : 'Add Employee'"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div class="grid grid-cols-6 md:grid-cols-12 gap-4">
          <div class="col-span-6 flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label for="email" class="text-sm font-bold">
                Email
                <span class="text-xs text-red-500"> * </span>
              </label>
              <InputText
                v-model="form.email"
                placeholder="Enter email address"
                :invalid="v$.email.$dirty && v$.email.$invalid"
                @blur="v$.email.$touch"
              />
              <small v-if="v$.email.$dirty && v$.email.$invalid" class="text-red-500">
                {{ v$.email?.$silentErrors[0]?.$message }}
              </small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="name" class="text-sm font-bold">
                Name
                <span class="text-xs text-red-500"> * </span>
              </label>
              <InputText
                v-model="form.name"
                placeholder="Enter name"
                :invalid="v$.name.$dirty && v$.name.$invalid"
                @blur="v$.name.$touch"
              />
              <small v-if="v$.name.$dirty && v$.name.$invalid" class="text-red-500">
                {{ v$.name?.$silentErrors[0]?.$message }}
              </small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="email" class="text-sm font-bold">
                Phone Number
                <span class="text-xs text-red-500"> * </span>
              </label>
              <InputMask
                v-model="form.phone"
                mask="?999999999999999"
                placeholder="Enter phone number"
                :invalid="v$.phone.$dirty && v$.phone.$invalid"
                @blur="v$.phone.$touch"
              />
              <small v-if="v$.phone.$dirty && v$.phone.$invalid" class="text-red-500">
                {{ v$.phone?.$silentErrors[0]?.$message }}
              </small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="gender" class="text-sm font-bold">
                Gender
                <span class="text-xs text-red-500"> * </span>
              </label>
              <div class="mt-2 flex flex-wrap gap-6">
                <div class="flex items-center">
                  <RadioButton v-model="form.gender" inputId="male" name="gender" value="male" />
                  <label for="male" class="ml-2">Male</label>
                </div>
                <div class="flex items-center">
                  <RadioButton
                    v-model="form.gender"
                    inputId="female"
                    name="gender"
                    value="female"
                  />
                  <label for="female" class="ml-2">Female</label>
                </div>
              </div>
              <small v-if="v$.gender.$dirty && v$.gender.$invalid" class="text-red-500">
                {{ v$.gender?.$silentErrors[0]?.$message }}
              </small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="dateOfBirth" class="text-sm font-bold">
                Date of Birth
                <span class="text-xs text-red-500"> * </span>
              </label>
              <DatePicker
                v-model="form.dateOfBirth"
                placeholder="Select date"
                :manualInput="false"
                dateFormat="dd/mm/yy"
                showButtonBar
                :invalid="v$.dateOfBirth.$dirty && v$.dateOfBirth.$invalid"
                @blur="v$.dateOfBirth.$touch"
              />
              <small v-if="v$.dateOfBirth.$dirty && v$.dateOfBirth.$invalid" class="text-red-500">
                {{ v$.dateOfBirth?.$silentErrors[0]?.$message }}
              </small>
            </div>
          </div>
          <div class="col-span-6 flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label for="department" class="text-sm font-bold">
                Department
                <span class="text-xs text-red-500"> * </span>
              </label>
              <Select
                v-model="form.department"
                :options="departments"
                filter
                optionLabel="title"
                placeholder="Select a Department"
                class="w-full"
                :invalid="v$.department.$dirty && v$.department.$invalid"
                @blur="v$.department.$touch"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center">
                    <div>{{ slotProps.value.title }}</div>
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center">
                    <div>{{ slotProps.option.title }}</div>
                  </div>
                </template>
              </Select>
              <small v-if="v$.department.$dirty && v$.department.$invalid" class="text-red-500">
                {{ v$.department?.$silentErrors[0]?.$message }}
              </small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="jobPosition" class="text-sm font-bold">
                Job Position
                <span class="text-xs text-red-500"> * </span>
              </label>
              <Select
                v-model="form.jobPosition"
                :options="jobPositions"
                filter
                optionLabel="title"
                placeholder="Select a Job Position"
                class="w-full"
                :invalid="v$.jobPosition.$dirty && v$.jobPosition.$invalid"
                @blur="v$.jobPosition.$touch"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center">
                    <div>{{ slotProps.value.title }}</div>
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center">
                    <div>{{ slotProps.option.title }}</div>
                  </div>
                </template>
              </Select>
              <small v-if="v$.jobPosition.$dirty && v$.jobPosition.$invalid" class="text-red-500">
                {{ v$.jobPosition?.$silentErrors[0]?.$message }}
              </small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="address" class="text-sm font-bold">
                Address
                <span class="text-xs text-red-500"> * </span>
              </label>
              <Textarea
                v-model="form.address"
                autoResize
                rows="8"
                cols="30"
                placeholder="Enter address"
                :invalid="v$.address.$dirty && v$.address.$invalid"
                @blur="v$.address.$touch"
              />
              <small v-if="v$.address.$dirty && v$.address.$invalid" class="text-red-500">
                {{ v$.address?.$silentErrors[0]?.$message }}
              </small>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          text
          @click="hideDialog"
          :disabled="isLoadingForm"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          @click="saveEmployee"
          :disabled="v$.$invalid || isLoadingForm"
          :loading="isLoadingForm"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteEmployeeDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="selectedEmployee">
          Are you sure you want to delete
          <b>{{ selectedEmployee.name }}</b>
          ?
        </span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteEmployeeDialog = false"
          :disabled="isLoadingForm"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          @click="deleteEmployee"
          :disabled="isLoadingForm"
          :loading="isLoadingForm"
        />
      </template>
    </Dialog>
  </div>
</template>
