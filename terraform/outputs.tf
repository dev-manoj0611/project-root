output "ecr_repo_url" {
  value = aws_ecr_repository.app_repo.repository_url
}

output "load_balancer_dns" {
  value = aws_lb.app_alb.dns_name
}

output "db_endpoint" {
  value = aws_db_instance.db.address
}
