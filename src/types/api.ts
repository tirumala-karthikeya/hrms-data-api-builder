
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  description: string;
  category: string;
  requiresId?: boolean;
  hasBody?: boolean;
}

export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  value?: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  error?: string;
  headers: Record<string, string>;
  time?: number;
}

export interface EmployeeData {
  employee_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  hire_date?: string;
  job_title?: string;
  job_id?: number;
  gov_id?: string;
  hiring_manager_id?: string;
  hr_manager_id?: string;
  marital_status?: string;
  state?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  sex?: string;
  department?: string;
  date_of_birth?: string;
  status?: string;
}

export interface EmployeeInsuranceData {
  employee_id: string;
  plan_name?: string;
  insurance_plan_id?: string;
  enrollment_date?: string;
  coverage_type?: string;
  employee_contribution?: number;
  enrollment_time?: string;
}

export interface HarassmentReport {
  complaint_id?: number;
  victim_employee_id?: number;
  harasser_employee_id?: number;
  harassment_level?: string;
  description?: string;
  status?: string;
  review_body?: string;
  incident_date?: string;
  incident_time?: string;
  reported_date?: string;
  reported_time?: string;
  level?: string;
}

export interface InsurancePlan {
  plan_name: string;
  plan_id?: string;
  network?: string;
  deductible_individual_family?: string;
  out_of_pocket_maximum_individual_family?: string;
  coinsurance?: string;
  overall_lifetime_maximum?: string;
  rates_premium_employee_only?: number;
  rates_premium_employer_contribution_employee_only?: number;
  rates_premium_employee_contribution_employee_only?: number;
  rates_premium_employee_spouse?: number;
  rates_premium_employer_contribution_employee_spouse?: number;
  rates_premium_employee_contribution_employee_spouse?: number;
  rates_premium_employee_children?: number;
  rates_premium_employer_contribution_employee_children?: number;
  rates_premium_employee_contribution_employee_children?: number;
  rates_premium_family?: number;
  rates_premium_employer_contribution_family?: number;
  rates_premium_employee_contribution_family?: number;
}

export interface LeaveBalanceData {
  employee_id: string;
  annual_leave_balance?: number;
  sick_leave_balance?: number;
  personal_leave_balance?: number;
  unpaid_leave_taken?: number;
  leave_balance_updated_date?: string;
}

export interface LeaveRequest {
  employee_id?: string;
  application_id: number;
  start_date?: string;
  total_working_days_off?: number;
  total_days_off?: number;
  end_date?: string;
  deduction_from_salary?: number;
  leave_type?: string;
  reason?: string;
  request_date?: string;
  request_time?: string;
  reviewed_by?: string;
  status?: string;
  approved_by?: string;
}

export interface Payroll {
  employee_id: string;
  base_salary?: number;
  federal_tax?: number;
  state_tax?: number;
  total_tax?: number;
  month?: string;
  salary_received_day?: string;
}

export interface SalaryInfo {
  employee_id: string;
  base_salary?: number;
  salary_type?: string;
  bonus?: number;
  commission?: number;
  currency?: string;
  salary_grade?: string;
  last_salary_increase_date?: string;
}

export interface CompanyPolicy {
  title: string;
  content: string;
}

export interface ApiRequestOptions {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: any;
}
