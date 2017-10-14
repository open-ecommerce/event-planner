<?php

return [
    'class' => 'yii\web\UrlManager',
    'enablePrettyUrl' => true,
    'showScriptName' => false,
    'rules' => [
        // Pages
        ['pattern' => 'page/<slug>', 'route' => 'page/view'],
        // Articles
        ['pattern' => 'article/index', 'route' => 'article/index'],
        ['pattern' => 'article/attachment-download', 'route' => 'article/attachment-download'],
        ['pattern' => 'article/<slug>', 'route' => 'article/view'],
        // Books
        ['pattern' => 'book/index', 'route' => 'book/index'],
        ['pattern' => 'book/attachment-download', 'route' => 'book/attachment-download'],
        ['pattern' => 'book/<slug>', 'route' => 'book/view'],
        // Api Books
        ['class' => 'yii\rest\UrlRule', 'controller' => 'api/v1/article', 'only' => ['index', 'view', 'options']],
        ['class' => 'yii\rest\UrlRule', 'controller' => 'api/v1/book', 'only' => ['index', 'view', 'options']],
        ['class' => 'yii\rest\UrlRule', 'controller' => 'api/v1/user', 'only' => ['index', 'view', 'options']]
    ]
];
