variable "aws_region" {
  default = "ap-south-1"
}

variable "app_name" {
  default = "devops-app"
}

variable "container_port" {
  default = 3000
}

# DB variables
variable "db_username" {
  default = "postgres"
}

variable "db_password" {
  default = "Password123!"
}

variable "db_name" {
  default = "appdb"
}
