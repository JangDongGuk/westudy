pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'featrue/*',
                    credentialsId: 'github_access_token',
                    url: 'https://github.com/Junhyunny/jenkins-github-webhook.git'
            }
        }
    }
}


//'featrue/*'