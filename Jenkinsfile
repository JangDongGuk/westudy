pipeline {
    agent any
    
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
                echo "jenkins building..."
                sh :"cd /var/lib/jenkins/workspace/multi_branch_pipeline_main"
                sh "npm install"
                sh "npm run build"
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