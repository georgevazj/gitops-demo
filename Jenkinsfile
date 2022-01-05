pipeline {
  agent any
  environment {
    gitcommit = "${gitcommit}"
  }
  stages {
    stage('Verify commit') {
      steps {
        script {
            cleanWs()
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
            def app = docker.build("georgevazj/gitops-demo:${gitcommit}", ".")
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
            deployment = readFile('${WORKSPACE}/manifests/deployment.yaml')
            text = deployment.replaceAll("%image: georgevazj/gitops-demo:*%", "image: georgevazj/gitops-demo:${gitcommmit}") 
            writeFile file: "${WORKSPACE}/manifests/deployment.yaml", text: "${text}"
        }
        script {
            sh 'git config --global user.email "georgevazj@gmail.com"'
            sh 'git config --global user.name "Jenkins"'
            sh 'git add . && git commit -m "Update deployment.yaml"'
            sh 'git push'
        }
      }
    }

  }
  
}