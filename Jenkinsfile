pipeline {
  agent any
  stages {
    stage('Verify SCM') {
      steps {
        script {
            cleanWs()
            checkout scm
        }

      }
    }

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
            cleanWs()
        }

      }
    }

    stage('Update manifests') {
      steps {
        script {
            checkout([$class: 'GitSCM', branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'github-georgevazj', url: 'https://github.com/georgevazj/gitops-demo-ops.git']]])
            sh 'touch ${WORKSPACE}/manifests/deployment.yaml'
            sh 'git config --global user.email "georgevazj@gmail.com"'
            sh 'git config --global user.name "Jenkins"'
            sh 'git add . && git commit -m "Update deployment.yaml"'
            sh 'git push'
        }
      }
    }

  }
  environment {
    gitcommit = "${gitcommit}"
    manifests_git = 'https://github.com/georgevazj/gitops-demo-ops.git'
  }
}