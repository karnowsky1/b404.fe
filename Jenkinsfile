pipeline {

  agent {
    docker {
      image 'node'
    }
  }

  environment { 
      CI = 'true'
  }

  stages {
    stage('Setup') {
      steps {
        sh '''
        pushd b404.fe
        npm install
        popd
        '''
      }
    }
    stage('Test') {
      steps {
          sh '''
          pushd b404.fe
          npm run test
          popd
          '''
        }
      }
      stage('Deliver') { 
        steps {
          sh '''
          pushd b404.fe
          npm build
          popd
          '''
      }
    }
  }
  post {
    success {
      archiveArtifacts artifacts: 'target/*.war', fingerprint: true
    }
  }
}
