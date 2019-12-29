pipeline {

  agent any

  stages {
    
    stage('Stage 1: Echo Build Env') {
      steps {
        sh '''
        echo "NODE VERSION:"
        docker run --rm -e CI=true -w /home/node/app -v $PWD/b404.fe:/home/node/app node:erbium-alpine node --version
        echo "NPM VERSION:"
        docker run --rm -e CI=true -w /home/node/app -v $PWD/b404.fe:/home/node/app node:erbium-alpine npm --version
        '''
      }
    }

    stage('Stage 2: Install Build Deps') {
      steps {
        sh '''
        docker run --rm -e CI=true -w /home/node/app -v $PWD/b404.fe:/home/node/app node:erbium-alpine npm install
        '''
      }
    }
    
    stage('Stage 3: Test') {
      steps {
        sh '''
        docker run --rm -e CI=true -w /home/node/app -v $PWD/b404.fe:/home/node/app node:erbium-alpine npm run test
        '''
      }
    }

    stage('Stage 4: Build') {
      steps {
        sh '''
        docker run --rm -e CI=true -w /home/node/app -v $PWD/b404.fe:/home/node/app node:erbium-alpine npm run build
        '''
      }
    }
  }

  post {
    success {
      archiveArtifacts artifacts: 'b404.fe/build/*', fingerprint: true
    }
    always {
      sh 'rm -rf b404.fe/node_modules'
    }
  }
}
