pipeline {

  agent any

  stages {
    
    stage('Stage 1: Setup') {
      steps {
        sh '''
        docker run --rm -w /home/node/app -v $PWD/b404.fe:/home/node/app node:erbium-alpine npm install
        '''
      }
    }
    
    stage('Stage 2: Build') {
      steps {
        sh '''
        docker run --rm -w /home/node/app -v $PWD/b404.fe:/home/node/app node:erbium-alpine npm install
        '''
      }
    }
  }

  post {
    success {
      archiveArtifacts artifacts: 'b404.fe/build/*', fingerprint: true
    }
  }
}
