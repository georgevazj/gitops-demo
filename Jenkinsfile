pipeline {
  agent any
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
        git(url: 'https://github.com/georgevazj/gitops-demo-ops.git', branch: 'main', credentialsId: 'github-georgevazj')
      }
    }

  }
  environment {
    gitcommit = "${gitcommit}"
    manifests_git = 'https://github.com/georgevazj/gitops-demo-ops.git'
  }
}