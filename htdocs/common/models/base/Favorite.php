<?php
// This class was automatically generated by a giiant build task
// You should not change it manually as it will be overwritten on next build

namespace common\models\base;

use Yii;

/**
 * This is the base-model class for table "user_favorite".
 *
 * @property integer $id
 * @property integer $user_id
 * @property integer $book_id
 * @property string $selectedTime
 * @property string $aliasModel
 */
abstract class Favorite extends \yii\db\ActiveRecord
{

    public static function tableName()
    {
        return 'user_favorite';
    }


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'book_id'], 'required'],
            [['user_id', 'book_id'], 'integer'],
            [['selectedTime'], 'safe']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('models', 'ID'),
            'user_id' => Yii::t('models', 'User ID'),
            'book_id' => Yii::t('models', 'Book ID'),
            'selectedTime' => Yii::t('models', 'Selected Time'),
        ];
    }


    
    /**
     * @inheritdoc
     * @return \common\models\query\FavoriteQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new \common\models\query\FavoriteQuery(get_called_class());
    }


}
