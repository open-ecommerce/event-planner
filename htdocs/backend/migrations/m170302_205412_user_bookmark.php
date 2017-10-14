<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205412_user_bookmark extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%user_bookmark}}',
            [
                'id'=> $this->primaryKey(11),
                'user_id'=> $this->integer(11)->null()->defaultValue(null),
                'bookmark_id'=> $this->integer(11)->null()->defaultValue(null),
                'url'=> $this->string(50)->notNull()->defaultValue('0'),
                'type'=> $this->integer(11)->notNull()->defaultValue(0),
                'selectedTime'=> $this->timestamp()->null()->defaultExpression("CURRENT_TIMESTAMP"),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%user_bookmark}}');
    }
}
