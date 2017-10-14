<?php

$config = [
    'name' => 'London Literary Scouts',
    'vendorPath' => dirname(dirname(__DIR__)) . '/vendor',
    'extensions' => require(__DIR__ . '/../../vendor/yiisoft/extensions.php'),
    'bootstrap' => ['log'],
    'modules' => [
        'treemanager' => [
            'class' => '\kartik\tree\Module',
        // other module settings, refer detailed documentation
        ],
        'newsletter' => [
            'class' => 'tikaraj21\newsletter\Newsletter',
        ],
        'comment' => [
            'class' => 'yii2mod\comments\Module',
        ],
    ],
    'components' => [
        'mobileDetect' => [
            'class' => '\skeeks\yii2\mobiledetect\MobileDetect'
        ],
        'authManager' => [
            'class' => 'yii\rbac\DbManager',
            'itemTable' => '{{%rbac_auth_item}}',
            'itemChildTable' => '{{%rbac_auth_item_child}}',
            'assignmentTable' => '{{%rbac_auth_assignment}}',
            'ruleTable' => '{{%rbac_auth_rule}}'
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
            'cachePath' => '@common/runtime/cache'
        ],
        'session' => [
            'class' => 'yii\web\DbSession',
            'writeCallback' => function ($session) {
                return [
                    'user_id' => Yii::$app->user->id,
                        //'last_write' => time(),
                ];
            },
        ],
        'email' => 'tikaraj21\newsletter\mailer\Mail',
        'commandBus' => [
            'class' => 'trntv\bus\CommandBus',
            'middlewares' => [
                [
                    'class' => '\trntv\bus\middlewares\BackgroundCommandMiddleware',
                    'backgroundHandlerPath' => '@console/yii',
                    'backgroundHandlerRoute' => 'command-bus/handle',
                ]
            ]
        ],
        'formatter' => [
            'class' => 'yii\i18n\Formatter'
        ],
        'glide' => [
            'class' => 'trntv\glide\components\Glide',
            'sourcePath' => '@storage/web/source',
            'cachePath' => '@storage/cache',
            'urlManager' => 'urlManagerStorage',
            'maxImageSize' => env('GLIDE_MAX_IMAGE_SIZE'),
            'signKey' => env('GLIDE_SIGN_KEY')
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            'viewPath' => '@backend/mail',
            'useFileTransport' => false,
            // the transport it is defined in the env and below this file
            'messageConfig' => [
                'charset' => 'UTF-8',
                'from' => env('ADMIN_EMAIL')
            ]
        ],
        'db' => [
            'class' => 'yii\db\Connection',
            'dsn' => env('DB_DSN'),
            'username' => env('DB_USERNAME'),
            'password' => env('DB_PASSWORD'),
            'tablePrefix' => env('DB_TABLE_PREFIX'),
            'charset' => 'utf8',
            'enableSchemaCache' => YII_ENV_PROD,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                'db' => [
                    'class' => 'yii\log\DbTarget',
                    'levels' => ['error', 'warning'],
                    'except' => ['yii\web\HttpException:*', 'yii\i18n\I18N\*'],
                    'prefix' => function () {
                        $url = !Yii::$app->request->isConsoleRequest ? Yii::$app->request->getUrl() : null;
                        return sprintf('[%s][%s]', Yii::$app->id, $url);
                    },
                    'logVars' => [],
                    'logTable' => '{{%system_log}}'
                ],
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['info', 'trace', 'error', 'warning'],
                    'categories' => ['backend'],
                    'logVars' => [],
                    'logFile' => '@app/runtime/logs/backend.log',
                ],
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['info', 'trace', 'error', 'warning'],
                    'categories' => ['frontend'],
                    'logVars' => [],
                    'logFile' => '@app/runtime/logs/frontend.log',
                ],
            ],
        ],
        'i18n' => [
            'translations' => [
                'app' => [
                    'class' => 'yii\i18n\PhpMessageSource',
                    'basePath' => '@common/messages',
                ],
                '*' => [
                    'class' => 'yii\i18n\PhpMessageSource',
                    'basePath' => '@common/messages',
                    'fileMap' => [
                        'common' => 'common.php',
                        'backend' => 'backend.php',
                        'frontend' => 'frontend.php',
                    ],
                    'on missingTranslation' => ['\backend\modules\i18n\Module', 'missingTranslation']
                ],
            /* Uncomment this code to use DbMessageSource
              '*'=> [
              'class' => 'yii\i18n\DbMessageSource',
              'sourceMessageTable'=>'{{%i18n_source_message}}',
              'messageTable'=>'{{%i18n_message}}',
              'enableCaching' => YII_ENV_DEV,
              'cachingDuration' => 3600,
              'on missingTranslation' => ['\backend\modules\i18n\Module', 'missingTranslation']
              ],
             */
            ],
        ],
        'fileStorage' => [
            'class' => '\trntv\filekit\Storage',
            'baseUrl' => '@storageUrl/source',
            'filesystem' => [
                'class' => 'common\components\filesystem\LocalFlysystemBuilder',
                'path' => '@storage/web/source'
            ],
            'as log' => [
                'class' => 'common\behaviors\FileStorageLogBehavior',
                'component' => 'fileStorage'
            ]
        ],
        'keyStorage' => [
            'class' => 'common\components\keyStorage\KeyStorage'
        ],
        'urlManagerBackend' => \yii\helpers\ArrayHelper::merge(
                [
            'hostInfo' => Yii::getAlias('@backendUrl')
                ], require(Yii::getAlias('@backend/config/_urlManager.php'))
        ),
        'urlManagerFrontend' => \yii\helpers\ArrayHelper::merge(
                [
            'hostInfo' => Yii::getAlias('@frontendUrl')
                ], require(Yii::getAlias('@frontend/config/_urlManager.php'))
        ),
        'urlManagerStorage' => \yii\helpers\ArrayHelper::merge(
                [
            'hostInfo' => Yii::getAlias('@storageUrl')
                ], require(Yii::getAlias('@storage/config/_urlManager.php'))
        )
    ],
    'params' => [
        'adminEmail' => env('ADMIN_EMAIL'),
        'robotEmail' => env('ROBOT_EMAIL'),
        'publisher' => 1,
        'agent' => 2,
        'subagent' => 3,
        'audiovisual' => 4,
        'agency' => 5,
        'usagent' => 6,
        'translationagent' => 7,
        'availableLocales' => [
            'en' => 'English',
        ],
        'mailSendAnswer' => env('MAIL_SEND_ANSWER'),
        'subjectAnswer' => env('SUBJECT_ANSWER'),
    ],
];

if (YII_ENV_PROD) {
    $config['components']['log']['targets']['email'] = [
        'class' => 'yii\log\EmailTarget',
        'except' => ['yii\web\HttpException:*'],
        'levels' => ['error', 'warning'],
        'message' => ['from' => env('ROBOT_EMAIL'), 'to' => env('ADMIN_EMAIL')]
    ];
}

if (YII_ENV_DEV) {

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        'allowedIPs' => $allowedIPs,
    ];

    //$giiant = require __DIR__ . '/giiant.php';
    //$config = \yii\helpers\ArrayHelper::merge($config, $giiant);

    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        'allowedIPs' => ['127.0.0.1', '::1', '192.168.2.107'],
        'generators' => [
            // generator name
            'giiant-model' => [
                //generator class
                'class' => 'schmunk42\giiant\generators\model\Generator',
                //setting for out templates
                'templates' => [
                    // template name => path to template
                    'oemodel' =>
                    '/common/oetemplates/model/default',
                ]
            ]
        ],
    ];

    $config['components']['cache'] = [
        'class' => 'yii\caching\DummyCache'
    ];
    $config['components']['mailer']['transport'] = [
        'class' => 'Swift_SmtpTransport',
        'host' => env('SMTP_HOST'),
        'username' => env('SMTP_USER'),
        'password' => env('SMTP_PASSWORD'),
        'port' => env('SMTP_PORT'),
        'encryption' => env('SMTP_ENCRIPTATION'),
    ];
}

return $config;
