pipeline {

  agent {
    docker { 
      image 'node:erbium-alpine'
      args '--rm -ti -w /home/node/app -v $PWD/b404.fe:/home/node/app'
    }
  }

  stages {
    
    stage('Stage 1: Setup') {
      steps {
        sh 'npm install'
      }
    }
    
    stage('Stage 2: Build') {
      steps {
        sh 'npm run build'
      }
    }
  }

  post {
    success {
      archiveArtifacts artifacts: 'b404.fe/build/*', fingerprint: true
    }
  }
}
