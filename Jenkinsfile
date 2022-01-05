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
            contentReplace(configs: [fileContentReplaceConfig(configs: [fileContentReplaceItemConfig(matchCount: 0, replace: '${BUILD_TAG}', search: '(jenkins-gitops-demo-main-)(\\d+\\d+)')], fileEncoding: 'UTF-8', filePath: 'manifests/deployment.yaml')])
            def newFile = readFile('manifests/deployment.yaml')
            echo newFile
        }
        script {
            catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                withCredentials([usernamePassword(credentialsId: 'github-georgevazj', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                    def encodedPassword = URLEncoder.encode("$GIT_PASSWORD",'UTF-8')
                    sh "git config user.email georgevazj@gmail.com"
                    sh "git config user.name Jorge"
                    sh "git add ."
                    sh "git commit -m 'Triggered Build: ${env.BUILD_NUMBER}'"
                    sh "git push https://${GIT_USERNAME}:${encodedPassword}@github.com/${GIT_USERNAME}/gitops-demo-ops.git HEAD:main"
                }
            }
        }
      }
    }

  }
  
}