pipeline {
    agent any
    environment {
        gitcommit = "${gitcommit}"
    }
    stages {
        stage('Verify SCM') {
            steps {
                script {
                    checkout scm
                    sh "git rev-parse --short HEAD > .git/commit-id"                        
                    gitcommit = readFile('.git/commit-id').trim()
                }
            }
        }
        stage('Test') {
            steps {
                nodejs(nodeJSInstallationName: 'nodejs') {
                    sh 'npm install --only=dev'
                    sh 'npm test'
                }
            }
        }
        stage('Docker build & push') {
            steps {
                script{
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub') {
                        def app = docker.build("georgevazj/gitops-demo:${gitcommit}", ".")
                        app.push()
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                withCredentials([string(credentialsId: "argocd-deploy-role", variable: 'ARGOCD_AUTH_TOKEN')]) {
                    sh '''
                    ARGOCD_SERVER="argocd.rkeingresspoc.easycloudpocs.com"
                    APP_NAME="gitops-demo"
                    CONTAINER="georgevazj/gitops-demo:${gitcommit}"

                    # Deploy to ArgoCD
                    ARGOCD_SERVER=$ARGOCD_SERVER argocd --grpc-web app set $APP_NAME --insecure --dest-namespace $APP_NAME --directory-include manifests --project default
                    ARGOCD_SERVER=$ARGOCD_SERVER argocd --grpc-web app sync $APP_NAME --force --insecure
                    ARGOCD_SERVER=$ARGOCD_SERVER argocd --grpc-web app wait $APP_NAME --timeout 600 --insecure
                    '''
                }
            }
        }
    }
}