<?php

use kartik\widgets\Growl;
use yii\helpers\Html;
use yii\helpers\Url;


//Get all flash messages and loop through them
foreach (Yii::$app->session->getAllFlashes() as $message):;
    echo \kartik\widgets\Growl::widget([
        'type' => (!empty($message['type'])) ? $message['type'] : 'info',
        'title' => (!empty($message['title'])) ? Html::encode($message['title']) : 'Some info...',
        'icon' => (!empty($message['icon'])) ? $message['icon'] : 'fa fa-info',
        'body' => (!empty($message['message'])) ? Html::encode($message['message']) : $message,
        'showSeparator' => true,
        'delay' => 1, //This delay is how long before the message shows
        'pluginOptions' => [
            'delay' => (!empty($message['duration'])) ? $message['duration'] : 3000, //This delay is how long the message shows for
            'placement' => [
                'from' => (!empty($message['positonY'])) ? $message['positonY'] : 'top',
                'align' => (!empty($message['positonX'])) ? $message['positonX'] : 'center',
            ]
        ]
    ]);
endforeach;
?>
