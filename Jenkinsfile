pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        ECR_REPO = "862770535694.dkr.ecr.ap-south-1.amazonaws.com/devops-app"
        CLUSTER = "devops-app-cluster"
        SERVICE = "devops-app-service"
        IMAGE_TAG = "${BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/dev-manoj0611/hackathon.git'
            }
        }
		
		stage('Checkov Scan Terraform') {
            steps {
                sh '''
                docker run --rm \
                  -v $PWD:/tf \
                  bridgecrew/checkov \
                  -d /tf || true
                '''
            }
        }

		
		
		stage('Build Docker Image') {
			steps {
				sh 'docker build -t devops-app:latest ./app'
			}
		}


        stage('Trivy Scan') {
            steps {
                sh '''
                docker run --rm \
                  -v /var/run/docker.sock:/var/run/docker.sock \
                  aquasec/trivy image devops-app || true
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh '''
                    aws ecr get-login-password --region $AWS_REGION \
                    | docker login --username AWS --password-stdin $ECR_REPO
                    '''
                }
            }
        }

        stage('Push Image') {
			steps {
				sh '''
				docker tag devops-app:latest $ECR_REPO:$IMAGE_TAG
				docker tag devops-app:latest $ECR_REPO:latest

				docker push $ECR_REPO:$IMAGE_TAG
				docker push $ECR_REPO:latest
				'''
    }
}


        stage('Deploy to ECS') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh '''
                    aws ecs update-service \
                      --cluster $CLUSTER \
                      --service $SERVICE \
                      --force-new-deployment \
                      --region $AWS_REGION
                    '''
                }
            }
        }
    }
}

