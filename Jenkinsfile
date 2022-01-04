pipeline {
    agent any
    environment {
        gitcommit = "${gitcommit}"
        manifests_git = "https://github.com/georgevazj/gitops-demo-ops.git"
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
        stage('Update manifests') {
            steps {
                script {
                    sh "git clone ${manifests_git} manifests"
                    sh "ls manifests"
                }
            }
        }
    }
}