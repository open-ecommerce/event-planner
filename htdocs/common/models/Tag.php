<?php

namespace common\models;

use common\models\query\TagQuery;
use trntv\filekit\behaviors\UploadBehavior;
use Yii;
use yii\db\ActiveRecord;
use dosamigos\taggable\Taggable;


class Tag extends ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'tag'; // I use this instead of aliases
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name'], 'required'],
            [['frequency'], 'integer'],
            [['name'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'name' => Yii::t('app', 'Name'),
            'frequency' => Yii::t('app', 'Frequency'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBooks() // is a RELATIONSHIP to the model you wish to attach your tags
    {
        return $this->hasMany(Tags::className(), ['id' => 'book_id'])->viaTable('book_tag_assn', ['tag_id' => 'id']);
    }

    /**
     * @param string $name
     * @return Tag[]
     */
    public static function findAllByName($name)
    {
        return Tag::find()
            ->where(['like', 'name', $name])->limit(50)->all();
    }
}