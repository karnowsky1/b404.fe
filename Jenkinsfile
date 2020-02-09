pipeline {

  agent any

  stages {
    
    stage('Stage 1: Echo Build Env') {
      steps {
        sh '''
        echo "NODE VERSION:"
        docker run --rm -e CI=true -w /home/node/app -v $PWD/react:/home/node/app node:erbium node --version
        echo "NPM VERSION:"
        docker run --rm -e CI=true -w /home/node/app -v $PWD/react:/home/node/app node:erbium npm --version
        '''
      }
    }

    stage('Stage 2: Install Build Deps') {
      steps {
        sh '''
        docker run --rm -e CI=true -w /home/node/app -v $PWD/react:/home/node/app node:erbium npm install
        '''
      }
    }
    
    /*
    stage('Stage 3: Test') {
      steps {
        sh '''
        docker run --rm -e CI=true -w /home/node/app -v $PWD/react:/home/node/app node:erbium-alpine npm run test
        '''
      }
    }
    */

    stage('Stage 3: Build') {
      steps {
        sh '''
        docker run --rm -e CI=true -w /home/node/app -v $PWD/react:/home/node/app node:erbium npm run build
        '''
      }
    }

    stage ('Stage 4: Build and Publish Docker Image'){
      stages {
        stage ("When on Designated Branch") {
          when {
            anyOf{
              branch 'master'
              branch 'testing'
              branch 'dev'
            }
          }
          steps {
            script {
              docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                app = docker.build("znl2181/b404.fe:"+env.BRANCH_NAME)
                app.push()
              }
            }
          }
        }
      }
    }

    stage('Stage 5: Archive Artifacts') {
      steps {
        archiveArtifacts artifacts: 'react/build/*', fingerprint: true
      }
    }

    stage('Stage 4: SonarQube analysis') {
      stages {
        stage ("When on Designated Branch") {
          when {
            anyOf{
              branch 'dev'
            }
          }
          steps {
            try{
              withSonarQubeEnv(installationName: 'sonar.b404') {
                sh '''
                docker run --rm -w /home/node/app -v $PWD/react:/home/node/app node:erbium /bin/bash -c "npm install -g sonarqube-scanner; sonar-scanner"
                '''
              }
            } catch (err) {
              buildResult: 'SUCCESS' 
              stageResult: 'FAILURE'
            }
          }
        }
      }
    }
  }

  post {
    always {
        sh "sudo chmod -R 777 ."
        cleanWs()
    } 
  }
}
