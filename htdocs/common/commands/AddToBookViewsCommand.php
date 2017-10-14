<?php

namespace common\commands;

use Yii;
use yii\base\Object;
use common\models\BookViews;
use trntv\bus\interfaces\SelfHandlingCommand;


class AddToBookViewsCommand extends Object implements SelfHandlingCommand
{
    /**
     * @var integer
     */
    public $book_id;
    /**
     * @var integer
     */
    public $frequency;

    /**
     * @param AddToBookViewsCommand $command
     * @return bool
     */
    public function handle($command)
    {
        $currentUserId = Yii::$app->user->getId();
        
        $viewed = BookViews::find()->where(['user_id'=>$currentUserId, 'book_id'=>$command->book_id])->one();
        if (!$viewed) {
            $model = new BookViews();
            $model->book_id = $command->book_id;
            $model->user_id = $currentUserId;
            $model->frequency = 1;
            $model->save(false);                
        } else {
            $viewed->frequency = $viewed->frequency +1;
            $viewed->save(false);                            
        }


    }
}
