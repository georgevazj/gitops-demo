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
            def app = docker.build("georgevazj/gitops-demo:${BUILD_TAG}", ".")
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
            deployment = readFile('manifests/deployment.yaml')
            text = deployment.replaceAll("image: georgevazj/gitops-demo:*%", "image: georgevazj/gitops-demo:${BUILD_TAG}")
            echo text
            writeFile file: "manifests/deployment.yaml", text: "${text}"
        }
        script {
            sh 'git config --global user.email "georgevazj@gmail.com"'
            sh 'git config --global user.name "Jenkins"'
            sh 'git add . && git commit -m "Deployment ${BUILD_TAG}"'
            sh 'git push'
        }
      }
    }

  }
  
}