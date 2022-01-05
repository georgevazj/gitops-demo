pipeline {
  agent any
  stages {
      
    stage('Test') {
      steps {
        nodejs('nodejs') {
          sh 'npm install --only=dev'
          sh 'npm test'
        }

      }
    }

    stage('Docker build & push') {
      steps {
        script {
          docker.withRegistry('https://registry.hub.docker.com', 'docker-hub') {
            def app = docker.build("georgevazj/gitops-demo:latest", ".")
            app.push()
          }
        }

      }
    }

    stage('Update manifests') {
      steps {
        script {
            cleanWs()
            checkout([$class: 'GitSCM', branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'github-georgevazj', url: 'https://github.com/georgevazj/gitops-demo-ops.git']]])
            sh 'ls -lha'   
        }
      }
    }

  }
  environment {
    gitcommit = "${gitcommit}"
    manifests_git = 'https://github.com/georgevazj/gitops-demo-ops.git'
  }
}