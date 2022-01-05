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
        }
      }
    }

    stage('Update manifests') {
      steps {
        script {
            checkout([$class: 'GitSCM', branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'github-georgevazj', url: 'https://github.com/georgevazj/gitops-demo-ops.git']]])
            def deployment = readFile('manifests/deployment.yaml')
            deployment = contentReplace(configs: [fileContentReplaceConfig(configs: [fileContentReplaceItemConfig(matchCount: 1, replace: '${BUILD_TAG}', search: '(jenkins-gitops-demo-main-)\\d+')], fileEncoding: 'UTF-8', filePath: 'manifests/deployment.yaml')])
            echo deployment
            writeFile file: "manifests/deployment.yaml", text: "${deployment}"
        }
        script {
            sh 'git config --global user.email "georgevazj@gmail.com"'
            sh 'git config --global user.name "Jenkins"'
            sh 'git add . && git commit -m "Deployment ${BUILD_TAG}"'
            sh 'git push -u origin main'
            cleanWs()
        }
      }
    }

  }
  
}