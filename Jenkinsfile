pipeline {
    agent any
    environment {
        gitcommit = "${gitcommit}"
    }
    stages {
        stage('Verify SCM') {
            checkout scm
            sh "git rev-parse --short HEAD > .git/commit-id"                        
            gitcommit = readFile('.git/commit-id').trim()
        }
        stage('Test') {
            nodejs(nodeJSInstallationName: 'nodejs') {
                sh 'npm install --only=dev'
                sh 'npm test'
            }
        }
        stage('Docker build & push') {
            docker.withRegistry('https://registry.hub.docker.com', 'docker-hub') {
                def app = docker.build("georgevazj/gitops-demo:${gitcommit}", ".")
                app.push()
            }
        }
    } 
}