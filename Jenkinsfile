pipeline {
    agent any
    tools {nodejs "nodejs"}
    
    environment {
        SLACK_CHANNEL = '#jenkins'
    }

    stages {
        stage('Start') {
            steps {
                slackSend (channel: SLACK_CHANNEL , color: '#FFFFOO', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
            }
        }
    
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github_access_token',
                    url: 'https://github.com/JangDongGuk/westudy.git'
            }
        }

        stage('build') {
            steps {
                catchError {
                   echo "jenkins building..."
                    sh "npm install"
                    sh "npm run asd" 
                }
            }
            post {
                success {
                    echo 'Compile stage successful'
                }
                failure {
                    echo 'Compile stage failed'
                }
            }
        }
        stage('test') {
            steps {
                echo "test1"
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