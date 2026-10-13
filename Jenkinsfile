pipeline {
    agent any

    environment {
        AWS_REGION     = 'us-east-1'
        ECR_REPO_NAME  = 'my-app'
        IMAGE_TAG      = "${BUILD_NUMBER}"
    }

    stages {
        stage('1. Fetch AWS Account ID') {
            steps {
                script {
                    env.AWS_ACCOUNT_ID = sh(script: "aws sts get-caller-identity --query Account --output text", returnStdout: true).trim()
                }
            }
        }

        stage('2. Source Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sairamesh-7/ramesh_portfolio.git'
            }
        }

        stage('3. Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${env.AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('4. Push Image to ECR') {
            steps {
                script {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${env.AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    sh "docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage('5. Deploy to Kubernetes') {
            steps {
                script {
                    sh "sed -i 's|IMAGE_PLACEHOLDER|${env.AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:${IMAGE_TAG}|g' k8s/deployment.yaml"
                    sh "kubectl apply -f k8s/deployment.yaml"
                    sh "kubectl apply -f k8s/service.yaml"
                }
            }
        }

        stage('6. Verify Deployment') {
            steps {
                script {
                    sh "kubectl rollout status deployment/my-app-deployment"
                    sh "kubectl get svc my-app-service"
                }
            }
        }
    }

    post {
        always {
            sh "docker rmi ${env.AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:${IMAGE_TAG} || true"
        }
    }
}
