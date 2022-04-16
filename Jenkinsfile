pipeline {
    agent any
    
    environment {
        SLACK_CHANNEL = '#jenkins'
    }

    stage {
        stage('Start') {
            steps {
                slackSend (channel: SLACK_CHANNEL, color: '#FFFF00', message: "STARTEDL Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
            }
        }
    }
        stages {
            stage('Checkout') {
                steps {
                    git branch: 'featrue/*',
                        credentialsId: 'github_access_token',
                        url: 'https://github.com/Junhyunny/jenkins-github-webhook.git'
                }
            }
        }

    post {
        success {
            slackSend (channel: SLACK_CHANNEL, color: '#00FF00', message: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
        failure {
            slackSend (channel: SLACK_CHANNEL, color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
    }
}